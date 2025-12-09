import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Item from '../models/Item.js';

// Config for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from Backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URL = process.env.MONGO_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadLinks = () => {
    return new Promise((resolve, reject) => {
        const links = new Map();
        fs.createReadStream(path.join(__dirname, '../data/links.csv'))
            .pipe(csv())
            .on('data', (row) => {
                // row: { movieId, imdbId, tmdbId }
                if (row.tmdbId) {
                    links.set(row.movieId, row.tmdbId);
                }
            })
            .on('end', () => {
                console.log(`Loaded ${links.size} links.`);
                resolve(links);
            })
            .on('error', reject);
    });
};

const fetchTMDBData = async (tmdbId) => {
    try {
        const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
        const { data } = await axios.get(url);
        return {
            posterURL: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
            overview: data.overview,
            genres: data.genres ? data.genres.map(g => g.name) : [],
            releaseDate: data.release_date,
            tmdbId: tmdbId.toString()
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn(`TMDB ID ${tmdbId} not found.`);
            return null;
        }
        console.error(`Error fetching TMDB ID ${tmdbId}:`, error.message);
        return null;
    }
};

const processMovies = async () => {
    await connectDB();
    const linksMap = await loadLinks();
    
    const moviesStream = fs.createReadStream(path.join(__dirname, '../data/movies.csv')).pipe(csv());
    
    let count = 0;
    
    for await (const row of moviesStream) {
        // row: { movieId, title, genres }
        const movieId = row.movieId;
        const tmdbId = linksMap.get(movieId);
        
        if (!tmdbId) {
            console.log(`No TMDB ID for Movie ID ${movieId} (${row.title}), skipping API fetch.`);
            // Optionally insert with just CSV data
            continue;
        }

        // Rate limiting: sleep 100ms between requests (approx 10 req/sec)
        // TMDB limit is usually around 40-50 req/10sec depending on key type, so 250ms is safe.
        await sleep(200);

        const tmdbData = await fetchTMDBData(tmdbId);
        
        if (tmdbData) {
            const itemData = {
                itemId: movieId,
                title: row.title, // Use CSV title or TMDB title? User said "Reads movieId, title... from CSV"
                genres: tmdbData.genres.length > 0 ? tmdbData.genres : row.genres.split('|'),
                posterURL: tmdbData.posterURL,
                overview: tmdbData.overview,
                tmdbId: tmdbData.tmdbId,
                releaseDate: tmdbData.releaseDate
            };

            await Item.findOneAndUpdate(
                { itemId: movieId },
                itemData,
                { upsert: true, new: true }
            );
            
            count++;
            if (count % 10 === 0) process.stdout.write(`Processed ${count} movies...\r`);
        }
    }
    
    console.log(`\nFinished! Processed ${count} movies.`);
    process.exit();
};

const updatePopularityScores = async () => {
    await connectDB();
    console.log("Starting popularity score update...");

    // Get all items with a tmdbId
    // We can select only needed fields to save memory, but finding all is fine for 10k items.
    const items = await Item.find({ tmdbId: { $exists: true, $ne: null } }).select('itemId tmdbId title');
    console.log(`Found ${items.length} items to update.`);

    let count = 0;
    for (const item of items) {
        try {
            // Rate limiting
            await sleep(200); 

            const url = `https://api.themoviedb.org/3/movie/${item.tmdbId}?api_key=${TMDB_API_KEY}`;
            const { data } = await axios.get(url);
            
            if (data && data.popularity !== undefined) {
                await Item.updateOne(
                    { _id: item._id },
                    { $set: { popularityScore: data.popularity } }
                );
                count++;
                if (count % 10 === 0) process.stdout.write(`Updated ${count}/${items.length} scores...\r`);
            }
        } catch (error) {
            // 404 means TMDB ID is invalid or movie removed
            if (error.response && error.response.status === 404) {
                console.warn(`\nTMDB ID ${item.tmdbId} not found for ${item.title}. Skipping.`);
            } else {
                console.error(`\nError updating item ${item.itemId}: ${error.message}`);
            }
        }
    }
    console.log(`\nFinished! Updated ${count} items.`);
    process.exit();
};

// processMovies();
updatePopularityScores();

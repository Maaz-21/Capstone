# Backend seed

To populate the database with sample items and a demo user, run the seed script.

Make sure `.env` has your `MONGO_URI` and `JWT_SECRET` set. Then run:

```bash
node --experimental-specifier-resolution=node scripts/seed.js
```

Or with npm script (add to package.json scripts if desired):

```bash
node --experimental-specifier-resolution=node scripts/seed.js
```

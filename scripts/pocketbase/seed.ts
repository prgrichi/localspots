import 'dotenv/config';
import PocketBase from 'pocketbase';
import seedUsers from './data.json';

type SeedSpot = {
  name: string;
  category?: string;
  description: string;
  locationLat?: number | null;
  locationLng?: number | null;
  locationUpdatedAt?: string | null;
  created?: string;
  updated?: string;
};

type SeedCollection = {
  name: string;
  created?: string;
  updated?: string;
  spots: SeedSpot[];
};

type SeedUser = {
  email: string;
  password: string;
  name?: string;
  created?: string;
  updated?: string;
  collections: SeedCollection[];
};

type CreatedUser = {
  seed: SeedUser;
  id: string;
  email: string;
};

type CreatedCollection = {
  seed: SeedCollection;
  id: string;
  name: string;
  userId: string;
  userEmail: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} muss gesetzt sein.`);
  }

  return value;
}

function daysAgo(days: number, hour: number, minute: number): string {
  const date = new Date();

  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
}

function addMinutes(dateString: string, minutes: number): string {
  const date = new Date(dateString);

  date.setMinutes(date.getMinutes() + minutes);

  return date.toISOString();
}

const pb = new PocketBase(process.env.PB_URL || 'http://127.0.0.1:8091');

const adminEmail = requiredEnv('PB_ADMIN_EMAIL');
const adminPassword = requiredEnv('PB_ADMIN_PASSWORD');

async function deleteRecordsByFilter(collectionName: string, filter: string) {
  const records = await pb.collection(collectionName).getFullList({ filter });

  for (const record of records) {
    console.log(`Lösche ${collectionName}: ${record.id}`);
    await pb.collection(collectionName).delete(record.id);
  }
}

async function deleteExistingSeedData() {
  console.log('Lösche vorhandene Seed-Daten...');

  const seedEmails = (seedUsers as SeedUser[]).map(user => user.email);

  const existingUsers = [];

  for (const email of seedEmails) {
    try {
      const user = await pb
        .collection('users')
        .getFirstListItem(pb.filter('email = {:email}', { email }));

      existingUsers.push(user);
    } catch {
      // User existiert noch nicht, ist okay.
    }
  }

  if (existingUsers.length === 0) {
    console.log('Keine vorhandenen Seed-User gefunden.');
    return;
  }

  const existingUserIds = existingUsers.map(user => user.id);

  const existingCollections = [];

  for (const userId of existingUserIds) {
    const collections = await pb.collection('collections').getFullList({
      filter: pb.filter('owner = {:userId}', { userId }),
    });

    existingCollections.push(...collections);
  }

  const existingSpots = [];

  for (const collection of existingCollections) {
    const spots = await pb.collection('spots').getFullList({
      filter: pb.filter('collection = {:collectionId}', {
        collectionId: collection.id,
      }),
    });

    existingSpots.push(...spots);
  }

  // 1. Erst Favoriten löschen, weil spot_favorites auf spots zeigt
  for (const spot of existingSpots) {
    await deleteRecordsByFilter(
      'spot_favorites',
      pb.filter('spot = {:spotId}', { spotId: spot.id })
    );
  }

  // 2. Dann Spots löschen
  for (const spot of existingSpots) {
    console.log(`Lösche Spot: ${spot.name}`);
    await pb.collection('spots').delete(spot.id);
  }

  // 3. Dann Collections löschen
  for (const collection of existingCollections) {
    console.log(`Lösche Collection: ${collection.name}`);
    await pb.collection('collections').delete(collection.id);
  }

  // 4. Follows löschen, bevor Users gelöscht werden
  // WICHTIG: Falls deine Felder anders heißen, hier anpassen.
  for (const user of existingUsers) {
    await deleteRecordsByFilter(
      'follows',
      pb.filter('follower = {:userId} || following = {:userId}', {
        userId: user.id,
      })
    );
  }

  // 5. Dann Users löschen
  for (const user of existingUsers) {
    console.log(`Lösche User: ${user.email}`);
    await pb.collection('users').delete(user.id);
  }

  console.log('Vorhandene Seed-Daten gelöscht.');
}

async function seed() {
  console.log('Seeding PocketBase at:', process.env.PB_URL || 'http://127.0.0.1:8091');

  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);

  await deleteExistingSeedData();

  let activityOffsetDays = 18;

  const createdUsers: CreatedUser[] = [];

  // 1. Erst alle User erstellen
  for (const userSeed of seedUsers as SeedUser[]) {
    console.log(`Erstelle User: ${userSeed.email}`);

    const userCreated = userSeed.created ?? daysAgo(activityOffsetDays, 9, 15);
    const userUpdated = userSeed.updated ?? addMinutes(userCreated, 12);

    activityOffsetDays -= 2;

    const user = await pb.collection('users').create({
      email: userSeed.email,
      password: userSeed.password,
      passwordConfirm: userSeed.password,
      name: userSeed.name,
      emailVisibility: true,
      verified: true,
      created: userCreated,
      updated: userUpdated,
    });

    createdUsers.push({
      seed: userSeed,
      id: user.id,
      email: user.email,
    });
  }

  const createdCollections: CreatedCollection[] = [];

  // 2. Collections pro User durchmischen:
  // User A Collection 1, User B Collection 1, User C Collection 1,
  // User A Collection 2, User B Collection 2, User C Collection 2, ...
  const maxCollectionCount = Math.max(...createdUsers.map(user => user.seed.collections.length));

  for (let collectionIndex = 0; collectionIndex < maxCollectionCount; collectionIndex += 1) {
    for (const createdUser of createdUsers) {
      const collectionSeed = createdUser.seed.collections[collectionIndex];

      if (!collectionSeed) {
        continue;
      }

      console.log(`Erstelle Collection für ${createdUser.email}: ${collectionSeed.name}`);

      const collectionCreated = collectionSeed.created ?? daysAgo(activityOffsetDays, 17, 30);
      const collectionUpdated = collectionSeed.updated ?? addMinutes(collectionCreated, 8);

      activityOffsetDays -= 2;

      const collection = await pb.collection('collections').create({
        name: collectionSeed.name,
        owner: createdUser.id,
        members: [createdUser.id],
        created: collectionCreated,
        updated: collectionUpdated,
      });

      createdCollections.push({
        seed: collectionSeed,
        id: collection.id,
        name: collection.name,
        userId: createdUser.id,
        userEmail: createdUser.email,
      });
    }
  }

  // 3. Spots über alle Collections durchmischen:
  // Collection A Spot 1, Collection B Spot 1, Collection C Spot 1,
  // Collection A Spot 2, Collection B Spot 2, ...
  const maxSpotCount = Math.max(
    ...createdCollections.map(collection => collection.seed.spots.length)
  );

  for (let spotIndex = 0; spotIndex < maxSpotCount; spotIndex += 1) {
    for (const createdCollection of createdCollections) {
      const spotSeed = createdCollection.seed.spots[spotIndex];

      if (!spotSeed) {
        continue;
      }

      console.log(`Erstelle Spot für ${createdCollection.userEmail}: ${spotSeed.name}`);

      const spotCreated = spotSeed.created ?? daysAgo(activityOffsetDays, 18, 45);
      const spotUpdated = spotSeed.updated ?? addMinutes(spotCreated, 5);

      activityOffsetDays -= 1;

      await pb.collection('spots').create({
        name: spotSeed.name,
        category: spotSeed.category,
        description: spotSeed.description,
        collection: createdCollection.id,
        user: createdCollection.userId,
        locationLat: spotSeed.locationLat ?? null,
        locationLng: spotSeed.locationLng ?? null,
        locationUpdatedAt:
          spotSeed.locationLat != null && spotSeed.locationLng != null
            ? (spotSeed.locationUpdatedAt ?? new Date().toISOString())
            : null,
        created: spotCreated,
        updated: spotUpdated,
      });
    }
  }

  console.log('Seed fertig');
}

seed().catch(error => {
  console.error('Seed fehlgeschlagen');
  console.error(error);
  process.exit(1);
});

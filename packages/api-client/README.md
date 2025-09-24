# @nbw/api-client

A TypeScript API client for the NoteBlockWorld backend API, built with axios.

## Installation

Since this is a workspace package, you can import it in any other package:

```typescript
import { createApiClient, createDefaultConfig } from '@nbw/api-client';
// or
import { NoteBlockWorldApiClient } from '@nbw/api-client';
```

## Usage

### Basic Setup

```typescript
import { createApiClient, createDefaultConfig } from '@nbw/api-client';

// Create a client with default configuration
const client = createApiClient(createDefaultConfig('http://localhost:4000'));

// Or create with custom configuration
const client = createApiClient({
  baseURL: 'http://localhost:4000/v1',
  timeout: 30000,
  headers: {
    'Custom-Header': 'value',
  },
});
```

### Authentication

```typescript
// Set authentication tokens
client.setAuthTokens({
  accessToken: 'your-jwt-token',
  refreshToken: 'your-refresh-token',
});

// Clear tokens
client.clearAuthTokens();

// Get current tokens
const tokens = client.getAuthTokens();
```

### Using Services

The API client provides organized services for different modules:

#### Auth Service

```typescript
// Send magic link email
await client.auth.sendMagicLink({ destination: 'user@example.com' });

// Verify token
const verification = await client.auth.verifyToken();

// Get OAuth URLs
const githubUrl = client.auth.getGitHubLoginUrl();
const googleUrl = client.auth.getGoogleLoginUrl();
const discordUrl = client.auth.getDiscordLoginUrl();
```

#### User Service

```typescript
// Get current user
const user = await client.user.getMe();

// Get user by email or ID
const user = await client.user.getUser({ email: 'user@example.com' });

// Update username
await client.user.updateUsername({ username: 'newusername' });

// Get paginated users
const users = await client.user.getUsersPaginated({ page: 1, limit: 10 });
```

#### Song Service

```typescript
// Get songs with pagination and filtering
const songs = await client.song.getSongs({
  page: 1,
  limit: 20,
  sort: 'createdAt',
  order: 'desc',
});

// Get featured songs
const featured = await client.song.getSongs({ q: 'featured' });

// Get recent songs
const recent = await client.song.getSongs({ q: 'recent' });

// Get categories
const categories = await client.song.getSongs({ q: 'categories' });

// Get random songs
const random = await client.song.getSongs({
  q: 'random',
  count: 5,
  category: 'pop',
});

// Search songs
const searchResults = await client.song.searchSongs(
  { page: 1, limit: 10 },
  'my search query',
);

// Get specific song
const song = await client.song.getSong('song-id');

// Get song for editing (requires auth)
const editableSong = await client.song.getSongForEdit('song-id');

// Update song (requires auth)
await client.song.updateSong('song-id', songData);

// Upload new song (requires auth)
const file = new File([nbsFileContent], 'song.nbs');
const uploadResult = await client.song.uploadSong(file, {
  title: 'My Song',
  description: 'A great song',
  // ... other song metadata
});

// Get user's songs (requires auth)
const mySongs = await client.song.getMySongs({ page: 1, limit: 10 });

// Delete song (requires auth)
await client.song.deleteSong('song-id');

// Get download URL
const downloadUrl = client.song.getSongDownloadUrl('song-id', 'source');
```

#### Seed Service

```typescript
// Seed development data
await client.seed.seedDev();
```

### Error Handling

All methods return promises that may reject with an `ApiError`:

```typescript
try {
  const songs = await client.song.getSongs();
} catch (error) {
  console.error('API Error:', error.message);
  console.error('Status:', error.status);
  console.error('Code:', error.code);
}
```

### Using Individual Services

You can also import and use individual services:

```typescript
import { SongService, createDefaultConfig } from '@nbw/api-client';

const songService = new SongService(
  createDefaultConfig('http://localhost:4000'),
);
const songs = await songService.getSongs();
```

### Custom Extensions

Extend the base client for custom functionality:

```typescript
import { BaseApiClient } from '@nbw/api-client';

class CustomApiClient extends BaseApiClient {
  async customEndpoint() {
    return this.get('/custom-endpoint');
  }
}
```

## API Response Format

All API methods return an `ApiResponse<T>` object:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
```

## TypeScript Support

The client is fully typed using the DTOs from `@nbw/database`. All request/response types are properly typed for excellent IDE support and type checking.


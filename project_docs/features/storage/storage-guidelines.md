# File Storage Guidelines

## 1. Storage Buckets

We use four distinct storage buckets for better organization and security:

```typescript
const STORAGE_BUCKETS = {
  PUBLIC: 'public-assets',    // Publicly accessible assets (logos)
  SYSTEM: 'system-private',   // Internal system files
  CLIENT: 'client-docs',      // Client-specific documents
  TEMP: 'temp-storage'        // Temporary processing files
}
```

## 2. File Organization

### System Files (`system-private`)
```
system-private/
├── users/
│   └── {user_id}/
│       └── profile/
│           └── avatar.{ext}      # User profile photo
└── businesses/
    └── {business_id}/
        ├── logo/
        │   ├── short.{ext}       # Business short logo
        │   └── full.{ext}        # Business full logo
        └── documents/            # Business documents
```

### Public Assets (`public-assets`)
```
public-assets/
├── businesses/
│   └── {business_id}/
│       └── logo/
│           ├── short.{ext}
│           └── full.{ext}
└── clients/
    └── {client_id}/
        └── brand/
            └── logo.{ext}
```

### Client Documents (`client-docs`)
```
client-docs/
└── {client_id}/
    ├── routine_data/
    │   └── {YYYY-MM}/           # Monthly data folders
    ├── service_agreements/
    │   └── {YYYY}/              # Yearly agreement folders
    └── {feature_name}/          # Feature-specific folders
        └── {category}/
```

## 3. Path Generation

Always use the provided utility functions to generate paths:

```typescript
// User avatar
const { bucket, path } = STORAGE_PATHS.user.profile(userId);

// Business logo
const { bucket, path } = STORAGE_PATHS.business.logo(businessId, 'full');

// Client document
const { bucket, path } = STORAGE_PATHS.client.routineData(clientId, new Date());
```

## 4. File Rules

### Size Limits
- Profile Photos: 2MB
- Logos: 5MB
- Documents: 10MB

### Allowed Types
```typescript
const FILE_RULES = {
  avatar: {
    allowedTypes: ['image/jpeg', 'image/png'],
    dimensions: { maxWidth: 1024, maxHeight: 1024 }
  },
  logo: {
    allowedTypes: ['image/png', 'image/svg+xml'],
    dimensions: { maxWidth: 2048, maxHeight: 2048 }
  },
  document: {
    allowedTypes: ['application/pdf', '.docx', '.xlsx']
  }
};
```

## 5. URL Access Patterns

### Public URLs
- Direct CDN access
- Format: `https://cdn.example.com/{bucket}/{path}`
- Used for: Logos and public assets

### Private URLs
- Signed URLs with expiration
- Format: `https://storage.example.com/{bucket}/{path}?token={signed-token}`
- Used for: System and client documents

## 6. Best Practices

1. **Path Generation**
   - Never hardcode paths
   - Always use STORAGE_PATHS utility
   - Include proper file extensions

2. **File Operations**
   ```typescript
   // ✅ Correct way
   const { bucket, path } = STORAGE_PATHS.user.profile(userId);
   await uploadFile(bucket, path, file);

   // ❌ Never do this
   await uploadFile('system-private', `users/${userId}/profile/pic.jpg`, file);
   ```

3. **URL Handling**
   - Use getFileUrl for public assets
   - Use getSignedUrl for private files
   - Always handle URL expiration for signed URLs

4. **File Validation**
   - Always validate before upload
   - Check file size and type
   - Validate image dimensions where applicable

## 7. Common Operations

### Upload Files
```typescript
// Single file upload
const { bucket, path } = STORAGE_PATHS.client.routineData(clientId, new Date());
await uploadFile(bucket, path, file);

// Multiple files
await uploadFiles(bucket, path, files);
```

### Get File URLs
```typescript
// Public file
const logoUrl = getFileUrl(bucket, path);

// Private file with 1-hour expiry
const docUrl = await getSignedUrl(bucket, path, 3600);
```

### File Management
```typescript
// Delete file
await deleteFile(bucket, path);

// Move file
await moveFile(sourceBucket, sourcePath, destBucket, destPath);

// List files
const files = await listFiles(bucket, 'clients/123/routine_data/');
```

## 8. Security Considerations

1. **Access Control**
   - PUBLIC: Direct access, no authentication
   - SYSTEM: Internal access only
   - CLIENT: Client-specific access
   - TEMP: Short-lived access

2. **URL Security**
   - Use short expiration for signed URLs
   - Implement proper CORS policies
   - Validate user permissions

3. **File Validation**
   - Sanitize file names
   - Check file content types
   - Scan for malware

## 9. Error Handling

Always handle these common errors:
- File size exceeded
- Invalid file type
- Upload failures
- Permission denied
- Storage quota exceeded

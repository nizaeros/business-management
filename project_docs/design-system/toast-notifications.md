# Toast Notifications Guidelines

## Overview
We use `react-hot-toast` for displaying toast notifications throughout the application. This document outlines the standard practices for implementing toast notifications.

## Setup

### Installation
```bash
npm install react-hot-toast
```

### Provider Configuration
The Toaster provider is configured in `src/app/layout.tsx` with our standard styling and positioning:

```tsx
<Toaster 
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: '#fff',
      color: '#333',
    },
    success: {
      iconTheme: {
        primary: '#10B981',
        secondary: '#fff',
      },
    },
    error: {
      iconTheme: {
        primary: '#EF4444',
        secondary: '#fff',
      },
    },
  }}
/>
```

## Usage Guidelines

### Basic Usage
```typescript
import toast from 'react-hot-toast';

// Success notification
toast.success('Operation completed successfully');

// Error notification
toast.error('Operation failed. Please try again.');

// Loading notification
toast.loading('Processing...');

// Custom notification
toast('Custom message', {
  icon: '👋',
  duration: 3000,
});
```

### Standard Messages

1. **Create Operations**
   ```typescript
   toast.success('Item created successfully');
   toast.error('Failed to create item. Please try again.');
   ```

2. **Update Operations**
   ```typescript
   toast.success('Changes saved successfully');
   toast.error('Failed to save changes. Please try again.');
   ```

3. **Delete Operations**
   ```typescript
   toast.success('Item deleted successfully');
   toast.error('Failed to delete item. Please try again.');
   ```

4. **Upload Operations**
   ```typescript
   toast.success('File uploaded successfully');
   toast.error('Failed to upload file. Please try again.');
   ```

### Best Practices

1. **Timing**
   - Use success toasts after successful operations
   - Show error toasts when operations fail
   - Keep messages visible long enough to read (default 4000ms)

2. **Message Content**
   - Keep messages concise and clear
   - Use consistent wording across similar operations
   - Include specific action in the message

3. **Error Handling**
   - Always pair error toasts with console.error for debugging
   - Include specific error messages when possible
   - Consider user-friendly error messages for production

4. **Implementation Pattern**
```typescript
const handleOperation = async () => {
  try {
    setLoading(true);
    await performOperation();
    toast.success('Operation completed successfully');
  } catch (error) {
    console.error('Operation failed:', error);
    toast.error('Failed to complete operation. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Accessibility
- Toast notifications are automatically announced by screen readers
- Critical errors should not rely solely on toast notifications
- Consider using the `role` prop for important messages

## Examples

### Form Submission
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    await submitForm(data);
    toast.success('Form submitted successfully');
    router.push('/success-page');
  } catch (error) {
    console.error('Form submission error:', error);
    toast.error('Failed to submit form. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### File Upload
```typescript
const handleFileUpload = async (file: File) => {
  const toastId = toast.loading('Uploading file...');
  
  try {
    await uploadFile(file);
    toast.success('File uploaded successfully', { id: toastId });
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload file', { id: toastId });
  }
};
```

### Batch Operations
```typescript
const handleBatchOperation = async (items: Item[]) => {
  const promises = items.map(item => processItem(item));
  
  toast.promise(Promise.all(promises), {
    loading: 'Processing items...',
    success: 'All items processed successfully',
    error: 'Failed to process some items',
  });
};
```

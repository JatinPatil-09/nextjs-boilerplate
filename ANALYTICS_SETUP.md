# PostHog Analytics Setup

This Next.js boilerplate includes a complete PostHog analytics integration with type-safe implementation and high code quality standards.

## 🚀 Quick Start

### 1. Environment Configuration

Add the following environment variables to your `.env.local` file:

```bash
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 2. Get Your PostHog Key

1. Sign up at [posthog.com](https://posthog.com)
2. Create a new project
3. Copy your project API key (starts with `phc_`)
4. Add it to your environment variables

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Visit `/analytics-demo` to see the interactive demo
3. Check the PostHog dashboard to see events being tracked

## 📁 File Structure

```
src/
├── components/
│   └── analytics/
│       ├── index.ts                    # Export barrel
│       ├── posthog-provider.tsx        # Main provider component
│       └── posthog-page-view.tsx       # Page view tracking
├── hooks/
│   └── use-analytics.ts                # Analytics hook
└── app/
    ├── layout.tsx                      # Provider integration
    └── analytics-demo/
        └── page.tsx                    # Demo page
```

## 🎯 Usage Examples

### Basic Event Tracking

```tsx
import { useAnalytics } from "@/hooks";

function MyComponent() {
  const { track } = useAnalytics();

  const handleButtonClick = () => {
    track("button_clicked", {
      button_name: "hero_cta",
      page: "homepage",
      timestamp: new Date().toISOString(),
    });
  };

  return <button onClick={handleButtonClick}>Click Me</button>;
}
```

### User Identification

```tsx
import { useAnalytics } from "@/hooks";

function LoginComponent() {
  const { identify } = useAnalytics();

  const handleLogin = (user) => {
    identify(user.id, {
      email: user.email,
      name: user.name,
      plan: user.plan,
      signup_date: user.createdAt,
    });
  };

  // ... rest of component
}
```

### User Properties

```tsx
import { useAnalytics } from "@/hooks";

function ProfileComponent() {
  const { setUserProperties } = useAnalytics();

  const handleProfileUpdate = (data) => {
    setUserProperties({
      last_profile_update: new Date().toISOString(),
      preferences: data.preferences,
      subscription_status: data.subscription,
    });
  };

  // ... rest of component
}
```

## 🔧 Configuration Options

### PostHog Provider Options

The PostHog provider is configured with the following default settings:

```tsx
{
  api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: false,              // Manual control for better performance
  capture_pageleave: true,              // Track page exits
  disable_session_recording: false,     // Enable session recordings
  enable_recording_console_log: false,  // Disable console log recording
}
```

### Environment Variables

| Variable                       | Required | Default                   | Description                  |
| ------------------------------ | -------- | ------------------------- | ---------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`      | Yes      | -                         | Your PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST`     | No       | `https://app.posthog.com` | PostHog instance URL         |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | No       | `false`                   | Master switch for analytics  |

## ✨ Features

### Type Safety

- **Full TypeScript support** with strict type checking
- **Type-safe event properties** with custom interfaces
- **IntelliSense support** for all analytics methods

### Performance

- **Lazy loading** with React Suspense
- **Memoized callbacks** to prevent unnecessary re-renders
- **Conditional initialization** to avoid unnecessary API calls

### Code Quality

- **ESLint compliance** with Next.js recommended rules
- **Prettier formatting** for consistent code style
- **Comprehensive JSDoc** documentation
- **Error boundary protection** for graceful degradation

### Privacy & Security

- **Graceful degradation** when analytics is disabled
- **Environment-based configuration** for different deployment stages
- **Optional initialization** respects user privacy preferences

## 🛠️ Development

### Running Quality Checks

The project includes comprehensive quality checks:

```bash
# Run all quality checks
npm run quality:check

# Individual checks
npm run type-check    # TypeScript compilation
npm run lint         # ESLint validation
npm run format:check # Prettier formatting
```

### Adding New Analytics Events

1. **Define the event** in your component
2. **Use descriptive names** for events and properties
3. **Include relevant context** (page, user type, timestamp)
4. **Test thoroughly** using the demo page

### Best Practices

1. **Consistent Naming**: Use snake_case for event names and properties
2. **Meaningful Events**: Track user actions, not technical events
3. **Privacy First**: Avoid tracking PII without user consent
4. **Performance**: Batch events when possible
5. **Testing**: Always test analytics in development

## 🚦 Deployment

### Production Checklist

- [ ] PostHog project created and configured
- [ ] Environment variables set in production
- [ ] Analytics enabled (`NEXT_PUBLIC_ENABLE_ANALYTICS=true`)
- [ ] Event tracking tested and verified
- [ ] Privacy policy updated (if required)

### Monitoring

1. **PostHog Dashboard**: Monitor events and user behavior
2. **Error Tracking**: Watch for analytics-related errors
3. **Performance**: Monitor impact on app performance

## 🔍 Troubleshooting

### Analytics Not Working

1. **Check environment variables** are correctly set
2. **Verify PostHog key** is valid and active
3. **Ensure analytics is enabled** (`NEXT_PUBLIC_ENABLE_ANALYTICS=true`)
4. **Check browser console** for any errors

### Events Not Appearing

1. **Wait a few minutes** for events to appear in PostHog
2. **Check event names** for typos or formatting issues
3. **Verify network connectivity** and ad blockers
4. **Test with the demo page** to isolate issues

### TypeScript Errors

1. **Check import paths** are correct
2. **Verify type definitions** match the interfaces
3. **Run type checking** with `npm run type-check`
4. **Update dependencies** if using outdated versions

## 📚 Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Analytics Best Practices](https://nextjs.org/docs/basic-features/measuring-performance)
- [React Analytics Patterns](https://react.dev/learn/you-might-not-need-an-effect#sending-analytics)

## 🤝 Contributing

When contributing analytics-related features:

1. **Follow the existing patterns** and code style
2. **Add comprehensive tests** for new functionality
3. **Update documentation** for any API changes
4. **Run quality checks** before submitting PRs

## 📄 License

This analytics implementation follows the same license as the main project.

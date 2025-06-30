# PostHog Analytics Setup & Usage Guide

This Next.js boilerplate includes a complete PostHog analytics integration with type-safe implementation. Follow this guide to implement analytics properly in your application.

## Quick Setup (5 Minutes)

### 1. Get PostHog Credentials

1. Sign up at [posthog.com](https://posthog.com) (free tier available)
2. Create a new project
3. Copy your **Project API Key** (starts with `phc_`)

### 2. Environment Configuration

Add to your `.env.local` file:

```bash
# PostHog Configuration (Required)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 3. Test Installation

```bash
npm run dev
# Visit http://localhost:3000
# Check PostHog dashboard for "Page Viewed" events
```

## How to Use Analytics Properly

### Import the Hook

```tsx
import { useAnalytics } from "@/hooks/use-analytics";
```

### 1. Basic Event Tracking

Track user actions and interactions:

```tsx
function HeroSection() {
  const { track } = useAnalytics();

  const handleCTAClick = () => {
    track("cta_clicked", {
      location: "hero_section",
      button_text: "Get Started",
      page: "homepage",
    });
  };

  const handleVideoPlay = () => {
    track("video_played", {
      video_title: "Product Demo",
      video_duration: 120,
      autoplay: false,
    });
  };

  return (
    <section>
      <button onClick={handleCTAClick}>Get Started</button>
      <video onPlay={handleVideoPlay}>...</video>
    </section>
  );
}
```

### 2. User Authentication Tracking

Track user lifecycle events:

```tsx
function AuthComponent() {
  const { track, identify } = useAnalytics();

  const handleSignUp = async (userData) => {
    // Track the signup event
    track("user_signed_up", {
      method: "email", // or "google", "github"
      source: "header_cta",
      timestamp: new Date().toISOString()
    });

    // Identify the user for future events
    identify(userData.id, {
      email: userData.email,
      name: userData.name,
      signup_date: userData.createdAt,
      plan: "free"
    });
  };

  const handleSignIn = (userData) => {
    track("user_signed_in", {
      method: "email",
      last_login: new Date().toISOString()
    });

    identify(userData.id, {
      email: userData.email,
      last_login: new Date().toISOString()
    });
  };

  const handleSignOut = () => {
    track("user_signed_out");
    // Don't reset() here unless you want to clear the user session
  };

  return (
    // Your auth component JSX
  );
}
```

### 3. E-commerce / Conversion Tracking

Track business-critical events:

```tsx
function ProductPage({ product }) {
  const { track } = useAnalytics();

  const handleAddToCart = () => {
    track("product_added_to_cart", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      category: product.category,
      quantity: 1
    });
  };

  const handlePurchase = (orderData) => {
    track("purchase_completed", {
      order_id: orderData.id,
      total_amount: orderData.total,
      currency: "USD",
      items_count: orderData.items.length,
      payment_method: orderData.paymentMethod
    });
  };

  const handleProductView = () => {
    track("product_viewed", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      category: product.category
    });
  };

  useEffect(() => {
    handleProductView();
  }, [product.id]);

  return (
    // Your product component JSX
  );
}
```

### 4. Form Tracking

Track user engagement with forms:

```tsx
function ContactForm() {
  const { track } = useAnalytics();
  const [formStarted, setFormStarted] = useState(false);

  const handleFormStart = () => {
    if (!formStarted) {
      track("form_started", {
        form_name: "contact_form",
        page: "contact",
      });
      setFormStarted(true);
    }
  };

  const handleFormSubmit = (formData) => {
    track("form_submitted", {
      form_name: "contact_form",
      form_type: formData.inquiry_type,
      has_phone: Boolean(formData.phone),
      page: "contact",
    });
  };

  const handleFormError = (errors) => {
    track("form_error", {
      form_name: "contact_form",
      error_fields: Object.keys(errors),
      error_count: Object.keys(errors).length,
    });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        onFocus={handleFormStart}
        // ... other props
      />
      {/* Rest of form */}
    </form>
  );
}
```

### 5. Feature Usage Tracking

Track how users interact with your features:

```tsx
function Dashboard() {
  const { track, setUserProperties } = useAnalytics();

  const handleFeatureUsed = (featureName) => {
    track("feature_used", {
      feature_name: featureName,
      timestamp: new Date().toISOString(),
      page: "dashboard"
    });

    // Update user properties to show they've used this feature
    setUserProperties({
      [`last_used_${featureName}`]: new Date().toISOString(),
      [`has_used_${featureName}`]: true
    });
  };

  const handleSettingsOpen = () => {
    handleFeatureUsed("settings");
  };

  const handleReportGenerated = (reportType) => {
    track("report_generated", {
      report_type: reportType,
      timestamp: new Date().toISOString()
    });
    handleFeatureUsed("reports");
  };

  return (
    // Your dashboard JSX
  );
}
```

## Best Practices

### 1. Event Naming Convention

Use **snake_case** and descriptive names:

```tsx
// ✅ Good
track("checkout_completed");
track("video_played");
track("feature_toggled");

// ❌ Avoid
track("click");
track("event1");
track("userAction");
```

### 2. Property Standards

Include context and meaningful data:

```tsx
// ✅ Good - Rich context
track("button_clicked", {
  button_text: "Subscribe Now",
  location: "pricing_page_hero",
  user_plan: "free",
  timestamp: new Date().toISOString(),
});

// ❌ Poor - Minimal context
track("click", { button: "subscribe" });
```

### 3. User Identification Pattern

```tsx
// ✅ Identify users early and update properties
const { identify, setUserProperties } = useAnalytics();

// On login/signup
identify(user.id, {
  email: user.email,
  name: user.name,
  plan: user.plan,
  signup_date: user.createdAt,
});

// When user data changes
setUserProperties({
  plan: newPlan,
  last_action: "upgraded_plan",
});
```

### 4. Performance Considerations

```tsx
// ✅ Debounce rapid events
const debouncedTrack = useCallback(
  debounce((eventName, properties) => {
    track(eventName, properties);
  }, 500),
  [track]
);

// ✅ Check if analytics is enabled
const { track, isEnabled } = useAnalytics();

if (isEnabled) {
  track("expensive_calculation_started");
}
```

## Real-World Examples

### SaaS Dashboard Events

```tsx
const trackDashboardEvents = () => {
  const { track } = useAnalytics();

  return {
    // Core actions
    projectCreated: (project) =>
      track("project_created", {
        project_type: project.type,
        template_used: project.template,
        team_size: project.members.length,
      }),

    // Feature usage
    exportData: (format) =>
      track("data_exported", {
        export_format: format,
        data_size: "large", // or calculate actual size
        feature: "export",
      }),

    // User engagement
    helpOpened: (section) =>
      track("help_opened", {
        help_section: section,
        user_plan: "premium",
        page: "dashboard",
      }),
  };
};
```

### E-commerce Events

```tsx
const trackEcommerceEvents = () => {
  const { track } = useAnalytics();

  return {
    // Product interactions
    productViewed: (product) =>
      track("product_viewed", {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        category: product.category,
        in_stock: product.stock > 0,
      }),

    // Cart actions
    addedToCart: (product, quantity) =>
      track("added_to_cart", {
        product_id: product.id,
        quantity: quantity,
        cart_total: calculateCartTotal(),
        currency: "USD",
      }),

    // Checkout process
    checkoutStarted: (cart) =>
      track("checkout_started", {
        cart_value: cart.total,
        items_count: cart.items.length,
        currency: "USD",
      }),
  };
};
```

## Development vs Production

### Environment-Specific Tracking

```tsx
const { track, isEnabled } = useAnalytics();

// Only track in production or staging
if (process.env.NODE_ENV === "production" && isEnabled) {
  track("feature_used", properties);
}

// Or use environment variable
if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true") {
  track("debug_event", { env: process.env.NODE_ENV });
}
```

## Testing Your Analytics

### 1. Development Testing

```bash
# Start dev server
npm run dev

# Open browser console
# Trigger events in your app
# Check PostHog Live Events tab
```

### 2. Verify Events

In PostHog dashboard:

1. Go to **Live Events** tab
2. Trigger actions in your app
3. Confirm events appear with correct properties
4. Check user identification is working

### 3. Debug Common Issues

```tsx
function DebugAnalytics() {
  const { isEnabled, track } = useAnalytics();

  useEffect(() => {
    console.log("Analytics enabled:", isEnabled);
    console.log(
      "PostHog key:",
      process.env.NEXT_PUBLIC_POSTHOG_KEY?.substring(0, 10) + "..."
    );

    if (isEnabled) {
      track("debug_page_loaded", {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });
    }
  }, [isEnabled, track]);

  return (
    <div>
      <p>Analytics Status: {isEnabled ? "Enabled" : "Disabled"}</p>
      <button onClick={() => track("test_button_clicked")}>
        Test Analytics
      </button>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Events not showing up**
   - Check environment variables are set correctly
   - Verify PostHog key is valid
   - Check browser console for errors
   - Ensure ad blockers aren't blocking PostHog

2. **TypeScript errors**
   - Import types correctly: `import { useAnalytics } from "@/hooks/use-analytics"`
   - Ensure properties match the interface types

3. **Performance issues**
   - Don't track too frequently (debounce if needed)
   - Keep property objects small
   - Use `isEnabled` check for expensive operations

### Testing Commands

```bash
# Check if PostHog is loaded
# In browser console:
window.posthog !== undefined

# Test event tracking
# In browser console:
window.posthog.capture('test_event', { test: true })
```

This setup provides comprehensive, type-safe analytics that helps you understand user behavior and improve your application based on real data.

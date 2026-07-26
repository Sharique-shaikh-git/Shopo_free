# Testing Strategy
## AI-Powered Mobile-First Store Builder for Pakistan

**Document Version:** 1.0  
**Date:** July 8, 2026  
**Status:** Complete  

---

## 1. Testing Pyramid

```
┌─────────────────────────────────────────────────────────────┐
│                TESTING PYRAMID                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌─────────┐                               │
│                    │  E2E    │  10%                           │
│                    │ Tests   │                               │
│                    ├─────────┤                               │
│                 ┌──┤ Integr- │──┐                            │
│                 │  │ ation   │  │  20%                        │
│                 │  │ Tests   │  │                            │
│                 │  ├─────────┤  │                            │
│              ┌──┤  │  Unit   │  ├──┐                         │
│              │  │  │ Tests   │  │  │  70%                     │
│              │  │  │         │  │  │                         │
│              └──┴──┴─────────┴──┴──┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Testing Types

### Unit Tests (70%)

| Component | Tool | Coverage Target |
|-----------|------|-----------------|
| **Backend Logic** | Jest | 80% |
| **React Native Components** | React Native Testing Library | 80% |
| **Utility Functions** | Jest | 90% |
| **AI Service** | Jest | 70% |

### Integration Tests (20%)

| Component | Tool | Coverage Target |
|-----------|------|-----------------|
| **API Endpoints** | Supertest | 80% |
| **Database Operations** | Jest + PostgreSQL | 70% |
| **Payment Integration** | Jest + Mock | 80% |
| **WhatsApp Integration** | Jest + Mock | 70% |

### E2E Tests (10%)

| Scenario | Tool | Coverage |
|----------|------|----------|
| **User Signup** | Detox | Critical paths |
| **Product Creation** | Detox | Critical paths |
| **Order Flow** | Detox | Critical paths |
| **Payment Flow** | Detox | Critical paths |

---

## 3. Unit Test Examples

### Backend Service Test

```javascript
// tests/services/product.test.js
const { analyzeProduct } = require('../../src/services/ai');

describe('Product Analysis', () => {
  test('should analyze product image', async () => {
    const imageUrl = 'https://example.com/product.jpg';
    const result = await analyzeProduct(imageUrl);
    
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('suggestedPrice');
  });

  test('should return error for invalid image', async () => {
    const imageUrl = 'invalid-url';
    
    await expect(analyzeProduct(imageUrl)).rejects.toThrow();
  });
});
```

### React Native Component Test

```javascript
// tests/components/ProductCard.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../../src/components/ProductCard';

describe('ProductCard', () => {
  const product = {
    id: '1',
    title: 'Blue Shirt',
    price: 1299,
    imageUrl: 'https://example.com/shirt.jpg'
  };

  test('should render product details', () => {
    const { getByText } = render(
      <ProductCard product={product} onPress={() => {}} />
    );
    
    expect(getByText('Blue Shirt')).toBeTruthy();
    expect(getByText('PKR 1,299')).toBeTruthy();
  });

  test('should call onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ProductCard product={product} onPress={onPress} />
    );
    
    fireEvent.press(getByText('Blue Shirt'));
    expect(onPress).toHaveBeenCalledWith(product);
  });
});
```

---

## 4. Integration Test Examples

### API Endpoint Test

```javascript
// tests/api/products.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Products API', () => {
  let token;

  beforeAll(async () => {
    // Get auth token
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: '+923211234567', otp: '123456' });
    token = res.body.token;
  });

  test('should create product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Product',
        price: 999,
        description: 'Test description'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('should get products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

---

## 5. E2E Test Examples

### Detox Configuration

```javascript
// e2e/config.json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/jest.config.js",
  "apps": {
    "ios.debug": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/StoreBuilder.app",
      "build": "xcodebuild -workspace ios/StoreBuilder.xcworkspace -scheme StoreBuilder -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android.debug": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug"
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 14"
      }
    },
    "emulator": {
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_4"
      }
    }
  },
  "configurations": {
    "ios.sim.debug": {
      "device": "simulator",
      "app": "ios.debug"
    },
    "android.emu.debug": {
      "device": "emulator",
      "app": "android.debug"
    }
  }
}
```

### E2E Test

```javascript
// e2e/tests/onboarding.test.js
describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test('should complete onboarding', async () => {
    // Welcome screen
    await expect(element(by.text('Get Started'))).toBeVisible();
    await element(by.text('Get Started')).tap();

    // Language selection
    await expect(element(by.text('اردو'))).toBeVisible();
    await element(by.text('اردو')).tap();
    await element(by.text('Continue')).tap();

    // Phone verification
    await expect(element(by.text('Enter Your Phone Number'))).toBeVisible();
    await element(by.type('RCTTextInput')).typeText('3211234567');
    await element(by.text('Send Code')).tap();

    // OTP verification
    await expect(element(by.text('Enter Code'))).toBeVisible();
    await element(by.type('RCTTextInput')).typeText('123456');
    await element(by.text('Verify')).tap();

    // Shop setup
    await expect(element(by.text("What's your shop name?"))).toBeVisible();
    await element(by.type('RCTTextInput')).typeText('Test Shop');
    await element(by.text('Continue')).tap();

    // What do you sell?
    await expect(element(by.text('What do you sell?'))).toBeVisible();
    await element(by.type('RCTTextInput')).typeText('Clothing');
    await element(by.text('Continue')).tap();

    // Dashboard
    await expect(element(by.text('Assalam-o-Alaikum'))).toBeVisible();
  });
});
```

---

## 6. Test Coverage Targets

### Coverage by Component

| Component | Unit | Integration | E2E | Total |
|-----------|------|-------------|-----|-------|
| **Authentication** | 80% | 90% | 100% | 85% |
| **Product Management** | 80% | 80% | 100% | 83% |
| **Order Management** | 80% | 80% | 100% | 83% |
| **Payment** | 70% | 90% | 100% | 83% |
| **AI Service** | 70% | 70% | 50% | 67% |
| **WhatsApp** | 70% | 70% | 50% | 67% |
| **Analytics** | 80% | 70% | 50% | 70% |
| **Overall** | 77% | 80% | 75% | 77% |

---

## 7. Test Automation

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Test Commands

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (iOS)
npm run test:e2e:ios

# E2E tests (Android)
npm run test:e2e:android

# All tests
npm run test:all

# Coverage report
npm run test:coverage
```

---

## 8. Bug Tracking

### Bug Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **P0 - Critical** | App crashes, data loss | 4 hours |
| **P1 - High** | Major feature broken | 24 hours |
| **P2 - Medium** | Minor feature issue | 3 days |
| **P3 - Low** | Cosmetic issue | 1 week |

### Bug Report Template

```markdown
**Title:** [Brief description]

**Steps to Reproduce:**
1. Go to...
2. Tap on...
3. See error...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Screenshots:**
[If applicable]

**Device:**
- Model: Samsung Galaxy S21
- OS: Android 13
- App Version: 1.0.0
```

---

## Summary

| Metric | Target |
|--------|--------|
| **Unit Test Coverage** | 77% |
| **Integration Test Coverage** | 80% |
| **E2E Test Coverage** | 75% |
| **Critical Bug Response** | 4 hours |
| **High Bug Response** | 24 hours |

---

**Document Complete**  
**Next Document:** 08_Security_Compliance.md

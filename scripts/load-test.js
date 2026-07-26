import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // ramp up to 50 users
    { duration: '1m', target: 50 },  // stay at 50 users for 1 min
    { duration: '30s', target: 0 },  // ramp down to 0 users
  ],
};

export default function () {
  // Test the storefront Next.js homepage
  const res = http.get('http://localhost:3000');
  check(res, { 'status was 200': (r) => r.status == 200 });
  
  // Test API health (Assuming we have a health check, testing the base path for now)
  const apiRes = http.get('http://localhost:3001/v1/products');
  // API requires auth for /products so it will return 401 or 403, which is fine to test load
  check(apiRes, { 'status was 401 or 403': (r) => r.status == 401 || r.status == 403 });
  
  sleep(1);
}

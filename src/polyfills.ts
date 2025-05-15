// polyfills.ts
import { Buffer } from 'buffer';

if (typeof window.global === 'undefined') {
  window.global = window;
}

if (typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}
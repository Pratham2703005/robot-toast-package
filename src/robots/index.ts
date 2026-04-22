/**
 * robot-toast built-in robot images
 * ─────────────────────────────────────────────────────────────────────────────
 * Each robot is its own file, so modern bundlers can tree-shake unused ones.
 * Import only what you need:
 *
 *   import { wave, error } from 'robot-toast/robots';
 *   toast({ message: 'Hi!',  robotVariant: wave  });
 *   toast({ message: 'Oops', robotVariant: error, type: 'error' });
 *
 * For maximum guaranteed tree-shaking, import from the per-robot subpath:
 *
 *   import { wave }  from 'robot-toast/robots/wave';
 *   import { error } from 'robot-toast/robots/error';
 */

export { wave }        from './wave';
export { base }        from './base';
export { base2 }       from './base2';
export { success }     from './success';
export { error }       from './error';
export { angry }       from './angry';
export { angry2 }      from './angry2';
export { shock }       from './shock';
export { think }       from './think';
export { search }      from './search';
export { loading }     from './loading';
export { sleep }       from './sleep';
export { headPalm }    from './headPalm';
export { typing }      from './type';
export { validation }  from './validation';
export { validation2 } from './validation2';

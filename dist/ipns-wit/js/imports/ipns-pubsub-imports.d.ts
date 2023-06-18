export namespace IpnsPubsubImports {
  export function prnt(msg: string): void;
  export function publish(msg: Message): void;
  export function subscribe(topic: string): void;
  export function unsubscribe(topic: string): void;
}
import type { Message } from '../imports/types';
export { Message };

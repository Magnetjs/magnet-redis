import { Module } from 'magnet-core/module';
export default class Redis extends Module {
    setup(): Promise<void>;
    teardown(): Promise<void>;
}

import { CliBaseEnvironment as CliBaseEnvironmentImports } from './imports/cli-base-environment';
import { CliBasePreopens as CliBasePreopensImports } from './imports/cli-base-preopens';
import { CliBaseExit as CliBaseExitImports } from './imports/cli-base-exit';
import { CliBaseStdin as CliBaseStdinImports } from './imports/cli-base-stdin';
import { CliBaseStdout as CliBaseStdoutImports } from './imports/cli-base-stdout';
import { CliBaseStderr as CliBaseStderrImports } from './imports/cli-base-stderr';
import { ClocksWallClock as ClocksWallClockImports } from './imports/clocks-wall-clock';
import { FilesystemFilesystem as FilesystemFilesystemImports } from './imports/filesystem-filesystem';
import { IoStreams as IoStreamsImports } from './imports/io-streams';
import { RandomRandom as RandomRandomImports } from './imports/random-random';
export function parse(wat: string): Uint8Array;
export function print(binary: Uint8Array | ArrayBuffer): string;
export function componentNew(binary: Uint8Array | ArrayBuffer, adapters: [string, Uint8Array | ArrayBuffer][] | null): Uint8Array;
export function componentWit(binary: Uint8Array | ArrayBuffer): string;
export function componentEmbed(embedOpts: EmbedOpts): Uint8Array;
export function metadataShow(binary: Uint8Array | ArrayBuffer): ModuleMetadata[];
export function metadataAdd(binary: Uint8Array | ArrayBuffer, metadata: ProducersFields): Uint8Array;

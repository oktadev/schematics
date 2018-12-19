import { Rule } from '@angular-devkit/schematics';
export interface OktaOptions {
    clientId: string;
    issuer: string;
}
export default function (options: OktaOptions): Rule;

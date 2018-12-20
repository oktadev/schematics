import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
} from '@angular-devkit/schematics';

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      externalSchematic('@okta/shield', 'add-auth', {
        ...options,
        root: true,
      }),
    ])(host, context);
  };
}

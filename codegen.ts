import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset';

const config: CodegenConfig = {
  schema: process.env.VITE_API_URL as string,
  documents: ['src/**/*.gql'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      documentTransforms: [addTypenameSelectionDocumentTransform],
    },
  },
  ignoreNoDocuments: true,
};

export default config;

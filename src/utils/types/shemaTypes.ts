export interface IDocSchemaOptions {
  hasEditor?: boolean;
  tableUser?: string;

  skipPlugin?: {
    toJSON?: boolean;
    paginate?: boolean;
  };
}

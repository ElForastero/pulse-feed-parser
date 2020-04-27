export type Extension = {
  name: string;
  value: Maybe<string>;
  attrs: Maybe<Attrs>
  children: Maybe<Array<Extension>>
}

export type Attrs = {
  [key: string]: string
}

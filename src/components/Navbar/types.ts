export interface Module {
  title: string;
  to?: string;
  childs?: {
    title: string;
    to: string;
  }[];
}

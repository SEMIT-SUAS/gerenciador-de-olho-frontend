import type { ModuleChild } from './ModuleChild';

export interface Module {
  title: string;
  to: string;
  roles?: string[];
  childs?: ModuleChild[];
}

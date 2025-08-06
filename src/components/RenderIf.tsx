import type { ReactNode } from 'react';

type RenderIfProps = {
  condition: boolean;
  ifRender: ReactNode;
  elseRender?: ReactNode;
};

export function RenderIf({
  condition,
  ifRender,
  elseRender = null,
}: RenderIfProps) {
  return condition ? ifRender : elseRender;
}

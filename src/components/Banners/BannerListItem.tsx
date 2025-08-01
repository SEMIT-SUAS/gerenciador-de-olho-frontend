import type { BannerModel } from '@/types/Banner';
import { TableCell, TableRow } from '../ui/table';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';

type BannerListItemProps = {
  banner: BannerModel;
};

export function BannerListItem({ banner }: BannerListItemProps) {
  return (
    <>
      <TableRow key={banner.id}>
        <TableCell>
          <img
            src={banner.imagem}
            alt={banner.nome}
            className="h-14 w-auto rounded-md"
            loading="lazy"
          />
        </TableCell>
        <TableCell>{banner.nome}</TableCell>
        <TableCell>
          {banner.link && banner.link.length > 1 ? (
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {banner.link}
            </a>
          ) : (
            <span>Sem link</span>
          )}
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-4">
            <button className="text-blue-500 hover:text-blue-700">
              <IconEye stroke={2} size={18} />
            </button>
            <button className="text-green-500 hover:text-green-700">
              <IconEdit stroke={2} size={18} />
            </button>
            <button className="text-red-500 hover:text-red-700">
              <IconTrash stroke={2} size={18} />
            </button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

// import { FaMapPin, FaTrash } from 'react-icons/fa';
// import { Tag } from '../Tag';
// import type { DenunciaModel } from '@/types/Denuncia';
// import { calcularDiasAtras } from '@/utils/data';
// import { getDenunciaStatus } from '@/utils/getDenunciaStatus';
// import { useMemo } from 'react';
// import { Loading } from '@/components/Loading/Loading';
// import { useFiles } from '@/context/FilesContext';

// type DenunciaItemProps = {
//   denuncia: DenunciaModel;
//   onClick: () => void;
//   showDate: boolean;
//   onTrashClick?: () => void;
//   isDeletable: boolean;
//   showTag: boolean;
//   isSelected?: boolean;
// };

// export function DenunciaItem({
//   denuncia,
//   onClick,
//   showDate,
//   showTag,
//   isDeletable,
//   onTrashClick,
//   isSelected,
// }: DenunciaItemProps) {
//   const diasAtras = calcularDiasAtras(denuncia.criadaEm);
//   const denunciaStatus = getDenunciaStatus(denuncia);
//   const { getFileById, files } = useFiles();

//   const thumbImageURL = useMemo(() => {
//     return getFileById(denuncia.files[0].id)?.thumbnailURL;
//   }, [files]);

//   return (
//     <div
//       key={denuncia.id}
//       className={`flex items-start gap-4 rounded-lg shadow-sm cursor-pointer ${
//         isSelected ? 'bg-gray-100' : 'bg-white hover:bg-gray-50' //
//       }`}
//       onClick={onClick}
//     >
//       <div className="flex w-21 h-21 items-center justify-center">
//         {thumbImageURL ? (
//           <img
//             className="w-full h-full rounded-l-md object-cover flex-shrink-0"
//             src={thumbImageURL}
//             loading="lazy"
//             alt="Primeira imagem da denúncia"
//           />
//         ) : (
//           <Loading />
//         )}
//       </div>

//       <div className="flex flex-col flex-grow py-3 pr-3">
//         <div className="flex justify-between items-center">
//           <div>
//             {showDate && <p className="text-xs text-gray-500">{diasAtras}</p>}
//             <h3 className="font-semibold text-md text-gray-700 line-clamp-1">
//               {denuncia.tipo.nome}
//             </h3>
//           </div>

//           {showTag && <Tag status={denunciaStatus} />}

//           {isDeletable && (
//             <button
//               onClick={onTrashClick}
//               className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
//             >
//               <FaTrash />
//             </button>
//           )}
//         </div>

//         <p className="flex items-center text-xs text-gray-400 mt-1">
//           <span className="mr-1">
//             <FaMapPin />
//           </span>
//           <span className="line-clamp-1">
//             {`${denuncia.rua}, ${denuncia.bairro}`}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

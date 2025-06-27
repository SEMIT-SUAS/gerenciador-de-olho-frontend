import { FaArrowLeft } from 'react-icons/fa';


export const BackButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button className="self-start flex mb-4 text-sm text-white px-3 py-2 rounded-full bg-blue-500 font-semibold hover:bg-blue-600 transition-colors">
            <div >
                <FaArrowLeft className="inline-block mr-2" />
            </div>
                Voltar para a lista
        </button>
    );
}


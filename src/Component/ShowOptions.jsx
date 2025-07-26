import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const showOptions = ({options}) => {
 

  MySwal.fire({
    title: "Available options",
    html: (
      <div className="space-y-2 text-right">
        {options.map((opt) => (
          <div key={opt.id} className="p-2 bg-gray-100 rounded-lg shadow text-gray-700">
            {opt.text} 
          </div>
        ))}
      </div>
    ),
    showConfirmButton: true,
    confirmButtonText: 'CLOSE',
    customClass: {
      popup: 'rtl text-right font-sans',
      confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
    }
  });
};

export default showOptions;

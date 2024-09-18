import Swal from 'sweetalert2';

export const alertSuccess = (message) => {
    Swal.fire({
        title: 'Congratulations !!',
        text: `${message}`,
        icon: 'success',
    });
};

export const alertFail = (message, title = 'Oops...') => {
    Swal.fire({
        icon: 'error',
        title: `${title}`,
        text: `${message}`,
    });
};

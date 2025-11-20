import Snackbar from 'awesome-snackbar';

// Fonction pour afficher une snackbar avec un message et un style basé sur le succès ou l'échec
export const showSnackbar = (message: string, success: boolean = true) => {
  if (success) {
    new Snackbar(message, {
      position: 'bottom-center',
      style: {
        container: [
          ['background-color', '#28a745'],
          ['border-radius', '8px'],
        ],
        message: [['color', '#fff']],
        actionButton: [['color', '#fff']],
      },
    });
  } else {
    new Snackbar(message, {
      position: 'bottom-center',
      style: {
        container: [
          ['background-color', '#0D1B2A'],
          ['border-radius', '8px'],
        ],
        message: [['color', '#fff']],
        actionButton: [['color', '#fff']],
      },
    });
  }
};

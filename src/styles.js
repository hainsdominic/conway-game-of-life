import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(10, 'auto'),
    justifyContent: 'center',
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  controls: {
    margin: theme.spacing(2),
  },
  board: {
    justifyContent: 'center',
  },
}));

export default useStyles;

import React, { useState, useCallback, useRef, useEffect } from 'react';
import produce from 'immer';
import {
  CssBaseline,
  Container,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';
import useStyles from './styles';

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const App = () => {
  const classes = useStyles();
  const [gridSize, setGridSize] = useState({
    numRows: 20,
    numColumns: 20,
  });
  const [running, setRunning] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [grid, setGrid] = useState([]);

  const runningRef = useRef(running);
  runningRef.current = running;

  const generateEmptyGrid = useCallback(() => {
    const rows = [];
    for (let i = 0; i < gridSize.numRows; i++) {
      rows.push(Array.from(Array(gridSize.numColumns), () => 0));
    }

    return rows;
  }, [gridSize]);

  useEffect(() => {
    setGrid(generateEmptyGrid());
  }, [gridSize, generateEmptyGrid]);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < gridSize.numRows; i++) {
          for (let j = 0; j < gridSize.numColumns; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (
                newI >= 0 &&
                newI < gridSize.numRows &&
                newJ >= 0 &&
                newJ < gridSize.numColumns
              ) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, [gridSize]);

  const draw = (i, j) => {
    const newGrid = produce(grid, (gridCopy) => {
      gridCopy[i][j] = 1;
    });
    setGrid(newGrid);
  };

  const handleChange = (event) => {
    setGridSize(JSON.parse(event.target.value));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth='md' className={classes.container}>
        <ButtonGroup
          variant='contained'
          color='primary'
          aria-label='contained primary button group'
          className={classes.controls}
        >
          <Button
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? 'stop' : 'start'}
          </Button>
          <Button
            onClick={() => {
              const rows = [];
              for (let i = 0; i < gridSize.numRows; i++) {
                rows.push(
                  Array.from(Array(gridSize.numColumns), () =>
                    Math.random() > 0.7 ? 1 : 0
                  )
                );
              }

              setGrid(rows);
            }}
          >
            random
          </Button>
          <Button
            onClick={() => {
              setGrid(generateEmptyGrid());
            }}
          >
            clear
          </Button>
        </ButtonGroup>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='gridSize'>Grid Size</InputLabel>
          <Select
            native
            value={JSON.stringify(gridSize)}
            onChange={handleChange}
            inputProps={{
              name: 'gridSize',
              id: 'gridSize',
            }}
          >
            <option value={JSON.stringify({ numRows: 10, numColumns: 10 })}>
              10 x 10
            </option>
            <option value={JSON.stringify({ numRows: 20, numColumns: 20 })}>
              20 x 20
            </option>
            <option value={JSON.stringify({ numRows: 30, numColumns: 30 })}>
              30 x 30
            </option>
            <option value={JSON.stringify({ numRows: 40, numColumns: 40 })}>
              40 x 40
            </option>
          </Select>
        </FormControl>
        <div
          className={classes.board}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize.numColumns}, 20px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, j) => (
              <div
                key={`${i}${j}`}
                onClick={() => {
                  if (!drawing) draw(i, j);
                  setDrawing(!drawing);
                }}
                onMouseOver={() => {
                  if (drawing) draw(i, j);
                }}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][j] ? 'black' : undefined,
                  border: 'solid 1px black',
                }}
              />
            ))
          )}
        </div>
      </Container>
    </>
  );
};

export default App;

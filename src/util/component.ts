import { Shape } from '@antv/x6';

const factory: any = {};
factory.getRect = (x?: number, y?: number) => {
  return new Shape.Rect({
    x,
    y,
    width: 80,
    height: 40,
    attrs: {
      body: {
        fill: 'blue',
      },
      label: {
        text: '决策',
        fill: 'white',
      },
    },
    ports: {
      groups: {
        point: {
          position: {
            name: 'right',
          },
          attrs: {
            circle: {
              magnet: true,
              r: 5,
            },
          },
        },
      },
      items: [
        {
          id: 'port1',
          group: 'point',
        },
      ],
    },
  });
};
factory.getRectRadius = (x?: number, y?: number) => {
  return new Shape.Rect({
    x,
    y,
    width: 80,
    height: 40,
    attrs: {
      body: {
        fill: 'yellow',
        rx: 10,
        ry: 10,
      },
      label: {
        text: '函数',
      },
    },
    ports: {
      items: [
        {
          id: 'port5',
          args: {
            position: {
              name: 'top',
            },
          },
          attrs: { circle: { r: 5, magnet: true } },
        },
      ],
    },
  });
};
factory.getRhombus = () => {
  return new Shape.Polygon({
    width: 60,
    height: 60,
    points: '0,10 10,0 20,10 10,20',
    attrs: {
      body: {
        fill: 'Darkorange',
      },
      label: {
        text: '判断',
      },
    },
  });
};
factory.getTrapezoid = () => {
  return new Shape.Polygon({
    width: 100,
    height: 40,
    points: '5,0 25,0 20,10 0,10',
    attrs: {
      body: {
        fill: 'Green',
      },
      label: {
        text: 'switch',
      },
    },
  });
};
factory.getEllipse = () => {
  return new Shape.Ellipse({
    width: 90,
    height: 45,
    attrs: {
      body: {
        fill: 'Magenta',
      },
      label: {
        text: '规则',
      },
    },
  });
};
factory.getCircle = () => {
  return new Shape.Circle({
    width: 60,
    height: 60,
    attrs: {
      body: {
        fill: 'red',
      },
      label: {
        text: '运算符',
      },
    },
  });
};
factory.getSquare = () => {
  return new Shape.Rect({
    width: 60,
    height: 60,
    attrs: {
      body: {
        fill: 'grey',
      },
      label: {
        text: '常数',
      },
    },
  });
};
factory.getTriangle = () => {
  return new Shape.Polygon({
    width: 70,
    height: 60,
    points: '100,0 200,173 0,173',
    attrs: {
      body: {
        fill: 'GreenYellow',
      },
      label: {
        y: 12,
        text: '逻辑符',
      },
    },
  });
};
export default factory;

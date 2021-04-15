import { Shape } from '@antv/x6';

const factory: any = {};
factory.getRect = () => {
  return new Shape.Rect({
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
  });
};
factory.getRectRadius = () => {
  return new Shape.Rect({
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
    width: 80,
    height: 40,
    attrs: {
      body: {
        fill: 'Magenta',
      },
      label: {
        text: '逻辑符',
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
        text: '规则',
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
        text: '运算符',
      },
    },
  });
};
export default factory;

import { Shape, Markup } from '@antv/x6';

const factory: any = {};
function getGroup(position: any) {
  return {
    position: {
      name: position,
    },
    attrs: {
      circle: {
        r: 5,
        magnet: true,
        stroke: '#31d0c6',
        strokeWidth: 1,
        fill: '#fff',
      },
    },
  };
}
function getGroups() {
  const obj = {
    leftGroup: getGroup('left'),
    rightGroup: getGroup('right'),
    topGroup: getGroup('top'),
    bottomGroup: getGroup('bottom'),
  };
  return obj;
}
function getItems() {
  return [
    {
      group: 'leftGroup',
    },
    {
      group: 'rightGroup',
    },
    {
      group: 'topGroup',
    },
    {
      group: 'bottomGroup',
    },
  ];
}
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
        text: '触发器',
        fill: 'white',
      },
    },
    ports: {
      groups: getGroups(),
      items: getItems(),
    },
    data: {
      nodeType: 'TRIGGER',
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
      groups: getGroups(),
      items: getItems(),
    },
    data: {
      nodeType: 'FUNCTION',
    },
  });
};
factory.getRhombus = (x?: number, y?: number) => {
  return new Shape.Polygon({
    x,
    y,
    width: 90,
    height: 50,
    points: '0,10 20,0 40,10 20,20',
    attrs: {
      body: {
        fill: 'Darkorange',
      },
      label: {
        text: '判断',
      },
    },
    ports: {
      groups: getGroups(),
      items: getItems(),
    },
  });
};
factory.getTrapezoid = (x?: number, y?: number) => {
  return new Shape.Polygon({
    x,
    y,
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
    ports: {
      groups: getGroups(),
      items: getItems(),
    },
  });
};
factory.getEllipse = (x?: number, y?: number) => {
  return new Shape.Ellipse({
    x,
    y,
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
    ports: {
      groups: getGroups(),
      items: getItems(),
    },
  });
};
factory.getCircle = (x?: number, y?: number) => {
  return new Shape.Circle({
    x,
    y,
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
    ports: {
      groups: getGroups(),
      items: getItems(),
    },
    data: {
      nodeType: 'OPERATOR',
    },
  });
};
factory.getSquare = (x?: number, y?: number) => {
  return new Shape.Rect({
    x,
    y,
    width: 60,
    height: 60,
    attrs: {
      body: {
        fill: 'grey',
      },
      label: {
        text: '常量',
      },
    },
    ports: {
      groups: getGroups(),
      items: getItems(),
    },
    data: {
      nodeType: 'CONSTANT',
    },
  });
};
factory.getTriangle = (x?: number, y?: number) => {
  return new Shape.Polygon({
    x,
    y,
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
    ports: {
      groups: getGroups(),
      items: getItems(),
    },
  });
};
export default factory;

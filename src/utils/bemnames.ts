import classNames from 'classnames';

export const createBEM = (namespace:any) => {
  return {
    create: (blockName:any) => {
      let block = blockName;

      if (typeof namespace === 'string') {
        block = `${namespace}-${blockName}`;
      }

      return {
        b: (...more:any) => {
          return classNames(block, more);
        },
        e: (className:any, ...more:any) => {
          return classNames(`${block}__${className}`, more);
        },
        m: (className:any, ...more:any) => {
          return classNames(`${block}--${className}`, more);
        },
      };
    },
  };
};

export const bemNames = createBEM('cr');

export default bemNames;

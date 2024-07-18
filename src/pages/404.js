import dynamic from 'next/dynamic';

const Custom404 = dynamic(() => import('../component/Custom404'));

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default Custom404;

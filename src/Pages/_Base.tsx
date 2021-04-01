import { HTMLMotionProps, motion } from 'framer-motion';

const Page:React.FC = (props) => {
    return (
        <PageFade>
            {props.children}
        </PageFade>
    );
}

const PageFade:React.FC<HTMLMotionProps<"div">> = (props) => <motion.div
    initial={{opacity: 0}}
    animate={{ opacity: 1 }}
    exit={{opacity: 0}}
    transition={{ duration: .38 }}
    {...props}
/>

export default Page;
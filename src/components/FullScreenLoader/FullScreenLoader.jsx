import { motion, AnimatePresence } from 'framer-motion'
import './FullScreenLoader.scss'

function FullScreenLoader({ show = false, text = 'Đang tải...' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fs-loader-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fs-loader__backdrop" />
          <motion.div
            className="fs-loader__content"
            initial={{ scale: 0.92, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          >
            <div className="spinner">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="text">{text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FullScreenLoader



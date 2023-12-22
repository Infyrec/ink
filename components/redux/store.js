import { configureStore } from '@reduxjs/toolkit'
import slize from './slize'

export default configureStore({
  reducer: {
    slize: slize
  },
})
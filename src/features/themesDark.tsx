import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ThemesState {
    value: string
  }

const initialState: ThemesState ={
    value: 'Light',
  }; 
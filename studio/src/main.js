import { createClient } from 'sanity'
import { renderStudio } from 'sanity'
import config from '../sanity.config.js'

renderStudio(document.getElementById('sanity'), config)

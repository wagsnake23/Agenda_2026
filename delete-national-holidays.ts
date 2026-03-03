import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const titles = [
        'Ano Novo',
        'Tiradentes',
        'Independência do Brasil',
        'Natal',
        'Carnaval',
        'Páscoa',
        'Corpus Christi',
        'Sexta-feira Santa',
        'Quarta-feira de Cinzas'
    ];

    // Also add to the delete list Mothers Day and Fathers Day since they are dynamic now
    titles.push('Dia das Mães', 'Dia dos Pais');

    const { data, error } = await supabase
        .from('calendar_events')
        .delete()
        .in('title', titles);

    if (error) {
        console.error('Error deleting:', error);
    } else {
        console.log('Successfully deleted:', titles);
    }
}
run();

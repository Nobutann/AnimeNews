import Image from 'next/image';
import Link from 'next/link';

interface Anime {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
}
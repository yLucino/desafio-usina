export class MoviesModel {
  id?: number;
  title!: string;
  description!: string;
  gender!: string;
  year_release!: string;
  duration!: string;
  evaluation_note?: string;
  imageUrl!: string;
  comments?: string;
}
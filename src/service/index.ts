import { BlogUserApi } from './user.api';
import { BlogConfigsApi } from './configs.api';
import { BlogCategoryApi } from './category.api';
import { BlogMediaApi } from './media.api';
import { BlogMediaArticleApi } from './article.api';

export default {
  User: new BlogUserApi(),
  Configs: new BlogConfigsApi(),
  Category: new BlogCategoryApi(),
  Media: new BlogMediaApi(),
  Article: new BlogMediaArticleApi(),
}
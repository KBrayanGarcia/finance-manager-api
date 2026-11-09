import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CategoryType } from "../../common/enums/category-type.enum";
import { DEFAULT_CATEGORIES } from "./constants/default-categories.constant";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seedDefaultCategories(
    userId: string,
    manager?: EntityManager,
  ): Promise<Category[]> {
    const repo = manager
      ? manager.getRepository(Category)
      : this.categoryRepository;

    const existingCount = await repo.count({
      where: { userId },
    });

    if (existingCount > 0) {
      return repo.find({
        where: { userId, isActive: true },
        order: { name: "ASC" },
      });
    }

    const categoriesToCreate = DEFAULT_CATEGORIES.map((def) =>
      repo.create({
        userId,
        name: def.name,
        type: def.type,
        icon: def.icon,
        color: def.color,
        isActive: true,
      }),
    );

    return repo.save(categoriesToCreate);
  }

  async createCategory(params: {
    readonly userId: string;
    readonly dto: CreateCategoryDto;
  }): Promise<Category> {
    const category = this.categoryRepository.create({
      userId: params.userId,
      name: params.dto.name.trim(),
      type: params.dto.type,
      icon: params.dto.icon,
      color: params.dto.color,
      isActive: true,
    });

    return this.categoryRepository.save(category);
  }

  async findAllByUser(params: {
    readonly userId: string;
    readonly type?: CategoryType;
  }): Promise<Category[]> {
    const totalCount = await this.categoryRepository.count({
      where: { userId: params.userId },
    });

    if (totalCount === 0) {
      await this.seedDefaultCategories(params.userId);
    }

    const query = this.categoryRepository
      .createQueryBuilder("category")
      .where("category.isActive = :isActive", { isActive: true })
      .andWhere("category.userId = :userId", { userId: params.userId });

    if (params.type) {
      query.andWhere("category.type = :type", { type: params.type });
    }

    return query.orderBy("category.name", "ASC").getMany();
  }

  async findById(params: {
    readonly id: string;
    readonly userId: string;
  }): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: params.id, userId: params.userId },
    });

    if (!category) {
      throw new NotFoundException(
        `Categoría con ID ${params.id} no encontrada`,
      );
    }

    return category;
  }

  async updateCategory(params: {
    readonly id: string;
    readonly userId: string;
    readonly dto: UpdateCategoryDto;
  }): Promise<Category> {
    const category = await this.findById({
      id: params.id,
      userId: params.userId,
    });

    const updated = this.categoryRepository.merge(category, {
      name: params.dto.name?.trim() ?? category.name,
      type: params.dto.type ?? category.type,
      icon: params.dto.icon ?? category.icon,
      color: params.dto.color ?? category.color,
      isActive: params.dto.isActive ?? category.isActive,
    });

    return this.categoryRepository.save(updated);
  }

  async deleteCategory(params: {
    readonly id: string;
    readonly userId: string;
  }): Promise<void> {
    const category = await this.findById(params);
    await this.categoryRepository.save(
      this.categoryRepository.merge(category, { isActive: false }),
    );
  }
}

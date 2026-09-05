import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../users/entities/user.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { QueryTransactionDto } from "./dto/query-transaction.dto";
import { Transaction } from "./entities/transaction.entity";
import { TransactionsService } from "./transactions.service";

@UseGuards(JwtAuthGuard)
@Controller("transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async create(@CurrentUser() user: User, @Body() dto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionsService.createTransaction({
            userId: user.id,
            dto,
        });
    }

    @Get()
    async findAll(
        @CurrentUser() user: User,
        @Query() queryDto: QueryTransactionDto,
    ): Promise<{ readonly data: Transaction[]; readonly total: number }> {
        return this.transactionsService.findAllByUser({
            userId: user.id,
            queryDto,
        });
    }

    @Get(":id")
    async findOne(@CurrentUser() user: User, @Param("id", ParseUUIDPipe) id: string): Promise<Transaction> {
        return this.transactionsService.findById({ id, userId: user.id });
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    async remove(@CurrentUser() user: User, @Param("id", ParseUUIDPipe) id: string): Promise<void> {
        return this.transactionsService.deleteTransaction({ id, userId: user.id });
    }
}

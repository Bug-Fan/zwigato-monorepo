import {
  Body,
  Controller,
  Patch,
  Req,
  UseInterceptors,
  UploadedFiles,
  FileTypeValidator,
  ParseFilePipe,
  Get,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { DeliveryAgentService } from './delivery-agent.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfileReqDto } from './dto/request/updateProfile.req.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { storage } from './storage.helper';
import { ActiveDeliveryAgentAccountReqDto } from './dto/request/activeDeliveryAgentAccount.req.dto';
import { ActiveDeliveryAgentAccountResDto } from './dto/response/activeDeliveryAgentAccount.res.dto';
import { DeleteDeliverAgentResDto } from './dto/response/deleteDeliveryAgent.res.dto';
import { UpdateProfileResDto } from './dto/response/updateProfile.res.dto';
import { ListOrderResDto } from './dto/response/listOrder.res.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role.guard';
import { ROLE_CONSTANT } from 'src/roleConstant';
import { PickedResDto } from './dto/response/pickedOrder.res.dto';
import { AcceptOrderReqDto } from './dto/request/acceptOrder.req.dto';
import { AcceptOrderResDto } from './dto/response/acceptOrder.res.dto';
import { ReachDropLocationResDto } from './dto/response/reachDropLocation.res.dto';
import { OrderStatus } from 'src/db/entities/order.entity';
import { TripReportResDto } from './dto/response/tripReport.res.dto';
import { RejectOrderResDto } from './dto/response/rejectOrder.res.dto';
import { DeliverOrderResDto } from './dto/response/deliverOrder.res.dto';
import { FeedbackRatingResDto } from './dto/response/feedbackRating.res.dto';
import { FeedbackRatingReqDto } from './dto/request/feedbackRating.req.dto';
import { AvgRatingResDto } from './dto/response/avgRating.res.dto';
import { updateLocationRequestDto } from './dto/request/updatelocation.request.dto';
import { updateLocationResponseDto } from './dto/response/updatelocation.response.dto';

@UseGuards(AuthGuard('jwt'), new RoleGuard(ROLE_CONSTANT.ROLES.DELIVERYAGENT))
@ApiTags('DeliveryAgent')
@Controller('delivery-agent')
export class DeliveryAgentController {
  constructor(private deliveryAgentService: DeliveryAgentService) {}

  @Patch('updateDeliveryAgentProfile')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfileReqDto })
  @ApiCreatedResponse({
    type: UpdateProfileReqDto,
    description: 'Update Delivery Agent Profile',
  })
  @UseInterceptors(AnyFilesInterceptor(storage))
  async updateProfile(
    @Req() req,
    @Body() updateProfileReqDto: UpdateProfileReqDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
        fileIsRequired: false,
      }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<UpdateProfileResDto> {
    const uuid = req.user.payload.id;

    return await this.deliveryAgentService.updateProfile(
      updateProfileReqDto,
      files,
      uuid,
    );
  }

  @Patch('activeDeliveryAgentAccount')
  @ApiBearerAuth()
  @ApiBody({ type: ActiveDeliveryAgentAccountReqDto })
  @ApiCreatedResponse({
    type: ActiveDeliveryAgentAccountReqDto,
    description: 'Active Delivery Agent Account',
  })
  async activeAccount(
    @Req() req,
    @Body() activeDeliveryAgentAccountReqDto: ActiveDeliveryAgentAccountReqDto,
  ): Promise<ActiveDeliveryAgentAccountResDto> {
    const uuid = req.user.payload.id;
    return this.deliveryAgentService.activeAccount(
      activeDeliveryAgentAccountReqDto,
      uuid,
    );
  }

  @Patch('deleteDeliveryAgentAccount')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'delete Delivery Agent Account',
  })
  async deleteAccount(@Req() req): Promise<DeleteDeliverAgentResDto> {
    const uuid = req.user.payload.id;
    return this.deliveryAgentService.deleteAccount(true, uuid);
  }

  @Get('listOrder')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'list order',
  })
  async listOrder(@Req() req): Promise<ListOrderResDto> {
    const uuid = req.user.payload.id;
    return this.deliveryAgentService.listOrder(uuid);
  }

  @Get('listOrderByStatus')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'list order by status',
  })
  async listOrderByStatus(
    @Req() req,
    @Query() query,
  ): Promise<ListOrderResDto> {
    const uuid = req.user.payload.id;
    return this.deliveryAgentService.listOrderByStatus(uuid, query);
  }

  @Patch('acceptOrder/:uuid')
  @ApiBearerAuth()
  @ApiBody({ type: AcceptOrderReqDto })
  @ApiCreatedResponse({
    description: 'Accept Order',
    type: AcceptOrderReqDto,
  })
  async acceptOrder(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<AcceptOrderResDto> {
    const deliveryAgentid = req.user.payload.id;
    return this.deliveryAgentService.acceptOrder(uuid, deliveryAgentid);
  }

  // @Patch('rejectOrder/:uuid')
  // @ApiBearerAuth()
  // @ApiBody({ type: AcceptOrderReqDto })
  // @ApiCreatedResponse({
  //   description: 'Accept Order',
  //   type: AcceptOrderReqDto,
  // })
  // async rejectOrder(
  //   @Param('uuid', ParseUUIDPipe) uuid: string,
  // ): Promise<RejectOrderResDto> {
  //   return this.deliveryAgentService.rejectOrder(uuid);
  // }

  @Patch('pickedOrder/:uuid')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Picked Order',
  })
  async pickedOrder(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<AcceptOrderResDto> {
    return this.deliveryAgentService.pickedOrder(
      uuid,
      OrderStatus.DISPATCHED,
      'Order Picked Successfully',
    );
  }

  @Get('reachDropLocation/:uuid')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Reach order in your drop location',
  })
  async reachDropLocation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<ReachDropLocationResDto> {
    return this.deliveryAgentService.reachDropLocation(uuid);
  }

  @Patch('deliverOrder/:uuid')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Order Delivered',
  })
  async deliverOrder(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<DeliverOrderResDto> {
    const deliveragentId = req.user.payload.id;
    return this.deliveryAgentService.deliverOrder(
      uuid,
      OrderStatus.DELIVERED,
      deliveragentId,
      'Order Delivered Successfully',
    );
  }

  @Get('tripReport')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'trip Report',
  })
  async tripReport(@Req() req): Promise<TripReportResDto> {
    const uuid = req.user.payload.id;
    return this.deliveryAgentService.tripReport(uuid);
  }

  @Patch('feedback/:uuid')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'feedback and rating',
  })
  async feedbackRating(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() feedbackRatingReqDto: FeedbackRatingReqDto,
  ): Promise<FeedbackRatingResDto> {
    return this.deliveryAgentService.feedbackRating(uuid, feedbackRatingReqDto);
  }

  @Get('getAvgRating')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'get Average Rating',
  })
  async findAvgRating(@Req() req): Promise<AvgRatingResDto> {
    const uuid = req.user.payload.id;
    return this.deliveryAgentService.findAvgRating(uuid);
  }

  @Patch('updateLocation')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'update lat and long',
  })
  async updateLocation(
    // @Param('uuid') uuid: string,
    @Req() req,
    @Body() updateLocationRequest: updateLocationRequestDto,
  ): Promise<updateLocationResponseDto> {
    return this.deliveryAgentService.updateLocation(
      req.user.payload.id,
      updateLocationRequest,
    );
  }
}

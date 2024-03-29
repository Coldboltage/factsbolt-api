import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FullJob, Video } from './entities/video.entity';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CheckUrl } from './dto/check-url.dto';
import { TextOnlyDto } from './dto/text-only.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videoService.create(createVideoDto.link);
  }

  @Get()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }

  // @Get('find/get-or-generate-video')
  // async getOrGenerateVideo(
  //   @Body() createVideoDto: CreateVideoDto,
  // ): Promise<Video> {
  //   return this.videoService.getOrGenerateVideo(createVideoDto);
  // }

  @Get('find/get-or-generate-video')
  async getOrGenerateVideo(@Query('link') link: string): Promise<Video> {
    return this.videoService.getOrGenerateVideo(link);
  }

  @Get('find/get-or-generate-text')
  async textOnlyGenerate(@Body() textOnlyDto: TextOnlyDto) {
    return this.videoService.getOrGenerateText(textOnlyDto);
  }

  @Get('find/check-url')
  async checkURL(@Body() checkUrl: CheckUrl) {
    return this.videoService.checkURL(checkUrl.url);
  }

  // Message Pattern

  // @MessagePattern('completedJob')
  @EventPattern('completedJob')
  async completedJob(@Payload() data: FullJob): Promise<string> {
    console.log('Hello World');
    console.log(data);
    const result = await this.videoService.saveFullVideoJob(data);
    return `Hello, World!`;
  }
}

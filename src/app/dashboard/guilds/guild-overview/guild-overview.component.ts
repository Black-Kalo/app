import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { Lean } from 'src/app/types/entity-types';
import { GuildService } from '../../../services/guild.service';
import { TextChannelComponent } from '../text-channel/text-channel.component';

@Component({
  selector: 'app-guild-overview',
  templateUrl: './guild-overview.component.html',
  styleUrls: ['./guild-overview.component.css']
})
export class GuildOverviewComponent implements OnInit, AfterViewInit {
  public activeChannel: Lean.Channel;
  public guild: Lean.Guild;

  @ViewChild('textChannel')
  public textChannel: TextChannelComponent;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private guildService: GuildService,
    private router: Router,
  ) {}

  public async ngOnInit() {
    this.route.paramMap.subscribe(async(paramMap) => {
      const guildId = paramMap.get('guildId');
      const channelId = paramMap.get('channelId');

      this.guild = this.guildService.getGuild(guildId);
      this.activeChannel = this.channelService.get(guildId, channelId);
      
      const defaultChannel = this.guild.channels.filter(c => c.type === 'TEXT')[0];          
      if (defaultChannel && !channelId)
        await this.router.navigate([`/channels/${guildId}/${defaultChannel._id}`]);
    });
  }

  public async ngAfterViewInit() {
    await this.textChannel.init();
  }
}

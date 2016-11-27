/*
 * Squidex Headless CMS
 * 
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved
 */

import * as Ng2 from '@angular/core';
import * as Ng2Forms from '@angular/forms';

import {
    AccessTokenDto,
    AppsStoreService,
    AppClientDto,
    AppClientCreateDto,
    AppClientsService,
    fadeAnimation,
    ModalView,
    Notification,
    NotificationService,
    TitleService 
} from 'shared';

@Ng2.Component({
    selector: 'sqx-clients-page',
    styles,
    template,
    animations: [
        fadeAnimation
    ]
})
export class ClientsPageComponent implements Ng2.OnInit {
    private appSubscription: any | null = null;
    private appName: string | null = null;

    public modalDialog = new ModalView();

    public appClients: AppClientDto[];
    public appClientToken: AccessTokenDto;
    
    public creationError = '';
    public createForm =
        this.formBuilder.group({
            name: ['',
                [
                    Ng2Forms.Validators.required,
                    Ng2Forms.Validators.maxLength(40),
                    Ng2Forms.Validators.pattern('[a-z0-9]+(\-[a-z0-9]+)*')
                ]]
        });

    constructor(
        private readonly titles: TitleService,
        private readonly appsStore: AppsStoreService,
        private readonly appClientsService: AppClientsService,
        private readonly formBuilder: Ng2Forms.FormBuilder,
        private readonly notifications: NotificationService
    ) {
    }

    public ngOnInit() {
        this.appSubscription =
            this.appsStore.selectedApp.subscribe(app => {
                if (app) {
                    this.appName = app.name;

                    this.titles.setTitle('{appName} | Settings | Clients', { appName: app.name });

                    this.appClientsService.getClients(app.name)
                        .subscribe(clients => {
                            this.appClients = clients;
                        }, () => {
                            this.notifications.notify(Notification.error('Failed to load clients. Please reload squidex portal.'));
                            this.appClients = [];
                        });
                }
            });
    }

    public ngOnDestroy() {
        this.appSubscription.unsubscribe();
    }

    public fullAppName(client: AppClientDto): string {
        return this.appName + ':' + client.clientName;
    }

    public revokeClient(client: AppClientDto) {
        this.appClientsService.deleteClient(this.appName, client.clientName)
            .subscribe(() => {
                this.appClients.splice(this.appClients.indexOf(client), 1);
            }, error => {
                this.notifications.notify(Notification.error('Failed to revoke client. Please retry.'));
            });
    }

    public createToken(client: AppClientDto) {
        this.appClientsService.createToken(this.appName, client)
            .subscribe(token => {
                this.appClientToken = token;
                this.modalDialog.show();
            }, error => {
                this.notifications.notify(Notification.error('Failed to retrieve access token. Please retry.'));
            });
    }

    public attachClient() {
        this.createForm.markAsDirty();

        if (this.createForm.valid) {
            this.createForm.disable();

            const dto = new AppClientCreateDto(this.createForm.controls['name'].value);

            this.appClientsService.postClient(this.appName, dto)
                .subscribe(client => {
                    this.reset();
                    this.appClients.push(client);
                }, error => {
                    this.reset();
                    this.creationError = error;
                });
        }
    }

    private reset() {
        this.createForm.reset();
        this.createForm.enable();
        this.creationError = '';
    }
}


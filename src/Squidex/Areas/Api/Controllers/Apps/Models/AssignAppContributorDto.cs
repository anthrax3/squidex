﻿// ==========================================================================
//  Squidex Headless CMS
// ==========================================================================
//  Copyright (c) Squidex UG (haftungsbeschränkt)
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Squidex.Domain.Apps.Core.Apps;

namespace Squidex.Areas.Api.Controllers.Apps.Models
{
    public sealed class AssignAppContributorDto
    {
        /// <summary>
        /// The id or email of the user to add to the app.
        /// </summary>
        [Required]
        public string ContributorId { get; set; }

        /// <summary>
        /// The permission level as a contributor.
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public AppContributorPermission Permission { get; set; }
    }
}
# Copyright 2015 Hewlett-Packard Development Company, L.P.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.


from django.conf.urls import patterns
from django.conf.urls import url

from aggregate import AggregateResultsView
from results import ResultsView
from timeline import TimelineView

from api import TempestRunDetailsEndpoint
from api import TempestRunRawEndpoint
from api import TempestRunTreeEndpoint


urlpatterns = patterns(
    '',
    url(r'^results_(?P<provider_name>[\w_\.]+)_(?P<run_id>\d+).html$',
        ResultsView.as_view(),
        name='tempest_results'),
    url(r'^timeline_(?P<provider_name>[\w_\.]+)_(?P<run_id>\d+).html$',
        TimelineView.as_view(),
        name='tempest_timeline'),

    url(r'^api_tree_(?P<provider_name>[\w_\.]+)_(?P<run_id>\d+).json$',
        TempestRunTreeEndpoint.as_view(),
        name='tempest_api_tree'),
    url(r'^api_raw_(?P<provider_name>[\w_\.]+)_(?P<run_id>\d+).json$',
        TempestRunRawEndpoint.as_view(),
        name='tempest_api_raw'),
    url(r'^api_details_(?P<provider_name>[\w_\.]+)_(?P<run_id>\d+).json$',
        TempestRunDetailsEndpoint.as_view()),
    url(r'^api_details_(?P<provider_name>[\w_\.]+)_(?P<run_id>\d+)_'
        r'(?P<test_name>[^/]+).json$',
        TempestRunDetailsEndpoint.as_view()),

    url(r'^aggregate.html$',
        AggregateResultsView.as_view(),
        name='tempest_aggregate_results'),
)

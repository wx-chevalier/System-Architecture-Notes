package dev.davivieira.framework.adapters.output.h2.mappers;

import dev.davivieira.domain.entity.Router;
import dev.davivieira.domain.entity.Switch;
import dev.davivieira.domain.vo.*;
import dev.davivieira.framework.adapters.output.h2.data.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class RouterH2Mapper {

        public static Router toDomain(RouterData routerData){
            var routerType = RouterType.valueOf(routerData.getRouterType().name());
            var routerId = RouterId.withId(routerData.getRouterId().toString());
            var switchId = SwitchId.withId(routerData.getNetworkSwitch().getSwitchId().toString());
            var switchType = SwitchType.valueOf(routerData.getNetworkSwitch().getSwitchType().toString());
            var ip = IP.fromAddress(routerData.getNetworkSwitch().getIp().getAddress());
            var networks =  getNetworksFromData(routerData.getNetworkSwitch().getNetworks());

            var networkSwitch = new Switch(switchId, switchType,networks, ip);
            return new Router(routerType, routerId, networkSwitch);
        }


        public static RouterData toH2(Router router){
            var routerTypeData = RouterTypeData.valueOf(router.getRouterType().toString());
            var routerId = router.getRouterId().getUUID();
            var switchId = router.getNetworkSwitch().getSwitchId().getUUID();
            var switchTypeData = SwitchTypeData.valueOf(router.getNetworkSwitch().getSwitchType().toString());
            var ipData = IPData.fromAddress(router.getNetworkSwitch().getAddress().getIPAddress());
            var networkDataList = getNetworksFromDomain(router.retrieveNetworks(), routerId);

            var switchData = new SwitchData(
                    routerId,
                    switchId,
                    switchTypeData,
                    networkDataList,
                    ipData);
            return new RouterData(routerId, routerTypeData, switchData);
        }

        private static List<Network> getNetworksFromData(List<NetworkData> networkData){
            return networkData
                    .stream()
                    .map(network -> new Network(
                            IP.fromAddress(network.getIp().getAddress()),
                            network.getName(),
                            network.getCidr()))
                    .collect(Collectors.toList());
        }

        private static List<NetworkData> getNetworksFromDomain(List<Network> networks, UUID switchId){
            return  networks
                     .stream()
                     .map(network -> new NetworkData(
                            switchId,
                            IPData.fromAddress(network.getAddress().getIPAddress()),
                            network.getName(),
                            network.getCidr()))
                     .collect(Collectors.toList());
        }
}
